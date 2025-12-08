import configData from '@/data/config.json';

export default function BackgroundLayer() {
  const background = configData?.background;

  if (!background?.imageUrl) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${background.imageUrl})`,
          opacity: background.opacity || 0.3,
          filter: `blur(${background.blur || 5}px)`,
          zIndex: -2
        }}
      />
      {background.overlay && (
        <div 
          className="fixed inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/80"
          style={{ zIndex: -1 }}
        />
      )}
    </>
  );
}
