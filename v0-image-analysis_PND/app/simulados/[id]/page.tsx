import { getSimuladoById } from "@/lib/simulados"
import { SimuladoInterface } from "@/components/simulado-interface"
import { notFound } from "next/navigation"

interface SimuladoPageProps {
  params: {
    id: string
  }
}

export default async function SimuladoPage({ params }: SimuladoPageProps) {
  const simuladoData = await getSimuladoById(Number.parseInt(params.id))

  if (!simuladoData) {
    notFound()
  }

  return <SimuladoInterface simulado={simuladoData.simulado} questions={simuladoData.questions} />
}
