import { collection, getDocs, query, getCountFromServer, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

type ReportStats = {
  totalUsuarios: number;
  totalPacientes: number;
  totalSesiones: number;
  totalClics: number;
};

export const getReportStats = async (): Promise<ReportStats> => {
  const stats: ReportStats = {
    totalUsuarios: 0,
    totalPacientes: 0,
    totalSesiones: 0,
    totalClics: 0,
  };

  try {
    // Obtener total de usuarios
    const usersSnapshot = await getCountFromServer(collection(db, 'users'));
    stats.totalUsuarios = usersSnapshot.data().count;

    // Obtener total de pacientes y sesiones
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef);
    const usersSnapshot2 = await getDocs(usersQuery);
    
    // Usamos Promise.all para procesar los usuarios en paralelo
    const userStats = await Promise.all(
      usersSnapshot2.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        
        // Contar pacientes del usuario
        const patientsRef = collection(db, `users/${userId}/patients`);
        const patientsCount = (await getCountFromServer(patientsRef)).data().count;
        
        // Contar sesiones del usuario
        let sessionsCount = 0;
        const patientsSnapshot = await getDocs(patientsRef);
        
        // Reemplazar la sección anterior con:
        const sessionsRef = collection(db, `users/${userId}/sessions`);
        sessionsCount = (await getCountFromServer(sessionsRef)).data().count;
        
        return { patientsCount, sessionsCount };
      })
    );

    // Sumar todos los pacientes y sesiones
    stats.totalPacientes = userStats.reduce((sum, userStat) => sum + userStat.patientsCount, 0);
    stats.totalSesiones = userStats.reduce((sum, userStat) => sum + userStat.sessionsCount, 0);

    // Obtener total de clics (si existe la colección)
    try {
      const clicksRef = collection(db, 'buttonClicks');
      const clicksSnapshot = await getCountFromServer(clicksRef);
      stats.totalClics = clicksSnapshot.data().count;
    } catch (error) {
      console.log('No se encontró la colección de clics, se usará 0');
    }

    return stats;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
};

// En reportService.ts

// Función para registrar un clic
export const logButtonClick = async (buttonId: string, userId: string) => {
  try {
    const clicksRef = collection(db, 'buttonClicks');
    await addDoc(clicksRef, {
      buttonId,
      userId,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al registrar clic:", error);
  }
};

// Función para obtener el conteo de clics por botón
export const getButtonClicks = async (): Promise<Record<string, number>> => {
  try {
    const clicksRef = collection(db, 'buttonClicks');
    const snapshot = await getDocs(clicksRef);
    const clicks: Record<string, number> = {};

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const buttonId = data.buttonId;
      clicks[buttonId] = (clicks[buttonId] || 0) + 1;
    });

    return clicks;
  } catch (error) {
    console.error("Error al obtener clics de botones:", error);
    return {};
  }
};