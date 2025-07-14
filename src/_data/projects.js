import * as contentful from 'contentful'

const client = contentful.createClient({
  space: "lgzm9gvrxry2",
  accessToken: "rQJeJ_nnnfQnwkNICE0gcsmE-w_3oJSZzhqXRxgTKzQ",
})

const getProjects = async () => {
    const entries = await client.getEntries({
        content_type: 'project',
    })
    
    return entries.items
}

// return the projects
export default async () => {
    const entries = await getProjects()
    return entries
}