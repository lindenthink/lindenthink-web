import useApiFetch from '@/composables/useApiFetch'


export async function getArticle(id) {
    const fetch = useApiFetch()
    return await fetch(`/articles/${id}`)
}

