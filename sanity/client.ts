import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: 'l2dw01h9',
  dataset: 'production',
  apiVersion: '2026-01-01',
  useCdn: true,
})