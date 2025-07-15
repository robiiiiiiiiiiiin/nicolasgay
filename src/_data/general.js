import * as contentful from 'contentful'

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
})

const getGeneralOptions = async () => {
    const entries = await client.getEntries({
        content_type: 'generalOptions',
    })
    
    // Return first item if exists
    return entries.items.length > 0 ? entries.items[0].fields : {};
}

// return the projects
export default async () => {
    const entries = await getGeneralOptions()
    return entries
}