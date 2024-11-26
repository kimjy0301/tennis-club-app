import PlayerDetailClient from './PlayerDetailClient' ;

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function PlayerDetailPage({ params }: PageProps) {
  const { id } = params;
  
  return <PlayerDetailClient playerId={id} />;
}