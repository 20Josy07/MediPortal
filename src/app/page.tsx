import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, BarChart, Shield } from "lucide-react";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow">
        <section id="hero" className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Revolutionize Your Patient Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MediPortal offers a secure, intuitive, and efficient
                    platform for medical professionals to manage patient data
                    seamlessly.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started for Free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="medical dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Benefits
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Why Choose MediPortal?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to simplify your workflow, secure
                  patient data, and provide insightful analytics.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1 text-center">
                 <div className="flex justify-center items-center mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Efficient Workflow</h3>
                <p className="text-sm text-muted-foreground">
                  Streamline patient registration, data entry, and access with our intuitive interface.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Data Security</h3>
                <p className="text-sm text-muted-foreground">
                  State-of-the-art security measures to ensure patient data is always protected.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                  <BarChart className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Insightful Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Gain valuable insights from patient data to improve care quality (feature coming soon).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Get Started in 3 Simple Steps
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Joining MediPortal is quick and easy. Follow these steps to begin managing your patients more effectively.
              </p>
            </div>
            <div className="flex space-x-4">
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">1</div>
                      <h3 className="text-lg font-bold">Create an Account</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Sign up for free as a medical professional.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">2</div>
                      <h3 className="text-lg font-bold">Add Your Patients</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Easily add and manage your patient records in our secure dashboard.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">3</div>
                      <h3 className="text-lg font-bold">Manage with Ease</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Access patient history, add notes, and keep everything organized.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline mb-12">
              Trusted by Medical Professionals
            </h2>
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      "MediPortal has transformed how I manage my patient records. It's intuitive, secure, and saves me hours every week."
                    </p>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="doctor portrait" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Dr. Jane Doe</p>
                        <p className="text-sm text-muted-foreground">Cardiologist</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      "The best platform for patient management I've ever used. The dashboard is clean and makes finding patient information a breeze."
                    </p>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                         <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="medical professional" />
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Dr. Michael Smith</p>
                        <p className="text-sm text-muted-foreground">General Practitioner</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      "As a specialist, keeping detailed and organized notes is crucial. MediPortal's features are perfect for my needs."
                    </p>
                     <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="doctor person" />
                        <AvatarFallback>EW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Dr. Emily White</p>
                        <p className="text-sm text-muted-foreground">Neurologist</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Ready to Get Started?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              Sign up today and take the first step towards a more organized and efficient medical practice.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/signup">Create Your Free Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
