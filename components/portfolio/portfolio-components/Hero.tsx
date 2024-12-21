"use client";

import { HeroProps } from "./types";

const defaultProps: HeroProps = {
  title: "Welcome to My Portfolio",
  subtitle: "I'm a passionate creator building amazing digital experiences. Explore my work and let's create something amazing together.",
  backgroundType: "image",
  backgroundUrl: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80"
};

export function Hero({ 
  title = defaultProps.title,
  subtitle = defaultProps.subtitle,
  backgroundType = defaultProps.backgroundType,
  backgroundUrl = defaultProps.backgroundUrl
}: Partial<HeroProps>) {
  const backgroundStyle = {
    backgroundImage: backgroundType === 'image' ? `url(${backgroundUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <section className="w-full min-h-[500px] relative flex items-center">
      {backgroundType === 'video' ? (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundUrl}
        />
      ) : (
        <div className="absolute inset-0" style={backgroundStyle} />
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-20 bg-background/80 backdrop-blur-sm rounded-lg">
        <h1 className="text-5xl font-bold mb-6">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
}