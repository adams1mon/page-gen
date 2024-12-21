"use client";

import { AboutProps } from "./types";

const defaultProps: AboutProps = {
  title: "About Me",
  description: [
    "I'm a creative professional with a passion for building beautiful and functional digital experiences. With expertise in design and development, I bring ideas to life through clean code and intuitive interfaces.",
    "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the community."
  ],
  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
};

export function About({ 
  title = defaultProps.title,
  description = defaultProps.description,
  imageUrl = defaultProps.imageUrl
}: Partial<AboutProps>) {
  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-5xl mx-auto px-8">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div 
            className="aspect-square rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div>
            {description.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}