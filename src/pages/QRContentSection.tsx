import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { QR_TYPE_META, type QRType, QRTypeSelector, SectionCard } from '@/components/qr'
import { QRTypeForm } from '@/components/qr/forms'
import type { QRTypeDataMap } from '@/lib/qrTypes'

interface QRContentSectionProps {
  qrType: QRType
  qrTypeData: QRTypeDataMap
  onTypeChange: (type: QRType) => void
  onTypeDataChange: (type: QRType, data: QRTypeDataMap[QRType]) => void
}

export function QRContentSection({
  qrType,
  qrTypeData,
  onTypeChange,
  onTypeDataChange,
}: QRContentSectionProps) {
  const { t } = useTranslation()
  return (
    <SectionCard
      icon={<FileText className="size-4" aria-hidden="true" />}
      title={t('sections.qrContent.title')}
      description={t('sections.qrContent.description')}
    >
      <div className="space-y-4">
        <QRTypeForm
          type={qrType}
          value={qrTypeData[qrType]}
          onChange={value => onTypeDataChange(qrType, value)}
        />
        <QRTypeSelector value={qrType} onChange={onTypeChange} />
        <p className="text-[0.7rem] text-muted-foreground sm:text-xs">
          {QR_TYPE_META[qrType] ? t(`qrTypes.${qrType}Helper`) : ''}
        </p>
      </div>
    </SectionCard>
  )
}
