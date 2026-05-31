import { TUTORIALS } from '$lib/content/tutorials';

export const prerender = true;

export async function GET() {
	const baseUrl = 'https://council.eduard3v.com';

	const staticPages = [
		{
			loc: baseUrl,
			changefreq: 'weekly',
			priority: '1.0'
		}
	];

	const tutorialPages = TUTORIALS.map((t) => ({
		loc: `${baseUrl}/tutorials/${t.slug}`,
		changefreq: 'monthly',
		priority: '0.8'
	}));

	const allUrls = [...staticPages, ...tutorialPages];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
	.map(
		(u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
