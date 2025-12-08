import Navbar from '@/components/Navbar';
import PageEffects from '@/components/PageEffects';
import BackgroundLayer from '@/components/BackgroundLayer';
import AlbumClient from './AlbumClient';
import albumsData from '@/data/albums.json';
import configData from '@/data/config.json';

export interface Album {
  id: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export default function AlbumPage() {
  const albums = (albumsData.albums || []) as Album[];
  const effects = configData?.effects;

  return (
    <div className="min-h-screen pb-8 relative">
      <BackgroundLayer />
      <PageEffects effects={effects} />
      <Navbar />
      
      <AlbumClient albums={albums} />
    </div>
  );
}
