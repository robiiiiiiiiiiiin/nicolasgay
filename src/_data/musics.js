import * as contentful from 'contentful'

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
})

const getMusics = async () => {
    const entries = await client.getEntries({
        content_type: 'musics',
    })
    
    console.log("entries.items[0].fields.musics", entries.items[0].fields.musics);
    return entries.items[0].fields.musics
}

// return the Musics
export default async () => {
    const musics = await getMusics()
    return musics
}