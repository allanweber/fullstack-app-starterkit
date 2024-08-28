import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSendContact } from "@/services/landing";
import { ContactData, contactFormSchema } from "@/types/Landing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MessageDisplay } from "../MessageDisplay";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

function ContactForm({ setSent }: { setSent: (value: boolean) => void }) {
  const mutation = useSendContact();
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: ContactData) {
    mutation.mutate(values, {
      onSuccess: () => {
        setSent(true);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-4">
        <div className="flex flex-col md:!flex-row gap-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="mail@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Your message..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="mt-4" disabled={mutation.isPending || !form.formState.isValid}>
          Send Message
        </Button>
        <MessageDisplay message={mutation.error} variant="destructive" />
      </form>
    </Form>
  );
}

function AfterContactForm({ setSent }: { setSent: (value: boolean) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Thank you for reaching out!</h2>
      <p className="text-muted-foreground">
        We have received your message and will get back to you as soon as possible.
      </p>
      <Button onClick={() => setSent(false)}>Send another message</Button>
    </div>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="container py-24 sm:py-32">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <h2 className="text-lg text-primary mb-2 tracking-wider">Contact</h2>

            <h2 className="text-3xl md:text-4xl font-bold">Connect With Us</h2>
          </div>
          <p className="mb-8 text-muted-foreground lg:w-5/6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum ipsam sint enim
            exercitationem ex autem corrupti quas tenetur
          </p>

          <div className="flex flex-col gap-4">
            {/* <div>
              <div className="flex gap-2 mb-1">
                <Building2 />
                <div className="font-bold">Find us</div>
              </div>

              <div>742 Evergreen Terrace, Springfield, IL 62704</div>
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <Phone />
                <div className="font-bold">Call us</div>
              </div>

              <div>+1 (619) 123-4567</div>
            </div> */}

            <div>
              <div className="flex gap-2 mb-1">
                <Mail />
                <div className="font-bold">Mail US</div>
              </div>

              <div>a.cassianoweber@gmail.com</div>
            </div>

            {/* <div>
              <div className="flex gap-2">
                <Clock />
                <div className="font-bold">Visit us</div>
              </div>

              <div>
                <div>Monday - Friday</div>
                <div>8AM - 4PM</div>
              </div>
            </div> */}
          </div>
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="text-primary text-2xl"> </CardHeader>
          <CardContent>
            {sent ? <AfterContactForm setSent={setSent} /> : <ContactForm setSent={setSent} />}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
