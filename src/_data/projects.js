import * as contentful from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
})

const getProjects = async () => {
    const entries = await client.getEntries({
        content_type: 'project',
    })

    entries.items.forEach((item) => {
        if (item.fields.description) {
            item.fields.descriptionHtml = documentToHtmlString(item.fields.description)
        }
    })
    
    return entries.items
}

// return the projects
export default async () => {
    const entries = await getProjects()
    return entries
}