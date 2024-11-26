import PlayerDetailClient from './PlayerDetailClient' ;

interface PageProps {
  params: { id: string };
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  return <PlayerDetailClient playerId={id} />;
}