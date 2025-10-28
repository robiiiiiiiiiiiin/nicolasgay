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
    const projectsOrder = await client.getEntries({
        content_type: 'projectsOrder',
        limit: 1,
    })
    const order = projectsOrder.items[0].fields.order // array of projects in desired order

    // sort entries.items based on the order array
    entries.items.sort((a, b) => {
        const aObject = order.find(obj => obj.sys.id === a.sys.id);
        const bObject = order.find(obj => obj.sys.id === b.sys.id);
        return order.indexOf(aObject) - order.indexOf(bObject)
    })

    // convert rich text description to HTML
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