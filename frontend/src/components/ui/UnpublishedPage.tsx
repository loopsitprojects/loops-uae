import NotFound from '@/pages/NotFound'

interface UnpublishedPageProps {
  pageTitle?: string
}

export default function UnpublishedPage(_props: UnpublishedPageProps = {}) {
  return <NotFound />
}
