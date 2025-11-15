import InsightForm from '@/components/insight-form'

export default function EditInsightPage({ params }: { params: { id: string } }) {
  return <InsightForm insightId={params.id} />
}
