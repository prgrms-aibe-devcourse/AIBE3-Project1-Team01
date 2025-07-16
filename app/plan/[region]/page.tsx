import PlanPage from './PlanPage';

export async function generateStaticParams() {
  return [
    { region: 'seoul' },
    { region: 'busan' },
    { region: 'jeju' },
    { region: 'gangwon' },
    { region: 'gyeonggi' },
    { region: 'chungbuk' },
    { region: 'chungnam' },
    { region: 'jeonbuk' },
    { region: 'jeonnam' },
    { region: 'gyeongbuk' },
    { region: 'gyeongnam' },
  ];
}

export default function RegionPlanPage({ params }: { params: { region: string } }) {
  return <PlanPage region={params.region} />;
}