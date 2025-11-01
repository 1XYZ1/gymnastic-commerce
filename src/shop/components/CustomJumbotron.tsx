import { CONTENT } from "@/config/content.config";

interface CustomJumbotronProps {
  title: string;
  subTitle?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
}

export const CustomJumbotron = ({
  title,
  subTitle = CONTENT.jumbotron.defaultSubtitle,
  headingLevel = 'h1',
}: CustomJumbotronProps) => {
  const Heading = headingLevel;

  return (
    <section
      className="py-10 px-4 lg:px-8 bg-muted/30"
      aria-label="Sección principal"
    >
      <div className="container mx-auto text-center">
        <Heading className="font-montserrat text-2xl lg:text-5xl tracking-tight mb-6">
          {title}
        </Heading>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {subTitle}
        </p>
      </div>
    </section>
  );
};
