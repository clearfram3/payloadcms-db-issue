import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

initOpenNextCloudflareForDev()
