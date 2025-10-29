import { Suspense } from "react"
import BlogContent from "./blog-content"
import BlogLoading from "./loading"

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogContent />
    </Suspense>
  )
}
