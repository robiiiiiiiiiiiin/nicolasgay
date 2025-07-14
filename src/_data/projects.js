import * as contentful from 'contentful'

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
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