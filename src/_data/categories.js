import * as contentful from 'contentful'

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
})

const getCategories = async () => {
    const entries = await client.getEntries({
        content_type: 'category',
    })
    
    return entries.items
}

// return the Categories
export default async () => {
    const entries = await getCategories()
    return entries
}