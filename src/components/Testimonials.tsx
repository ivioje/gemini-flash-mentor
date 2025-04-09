
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "Alex Johnson",
      role: "Medical Student",
      content: "GemMentor has transformed my study habits. The AI-generated flashcards save me hours of preparation time, and the spaced repetition system ensures I retain what I learn.",
      avatar: "AJ",
    },
    {
      name: "Sarah Williams",
      role: "Law Student",
      content: "As a law student, I need to memorize vast amounts of information. This app has been my secret weapon for exam preparation. The streak feature keeps me motivated daily.",
      avatar: "SW",
    },
    {
      name: "Michael Chen",
      role: "Computer Science Major",
      content: "The AI understands my technical topics perfectly and creates challenging questions. I've seen a notable improvement in my exam scores since I started using GemMentor.",
      avatar: "MC",
    },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Join thousands of students who have improved their learning with GemMentor.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 pt-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.avatar}
                    </AvatarFallback>
                    <AvatarImage src="" alt={testimonial.name} />
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
