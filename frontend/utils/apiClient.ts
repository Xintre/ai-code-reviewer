/**
 * Creates a URL to the API using the URI passed in
 * @param uri The URI to query for
 */
function makeURL(uri: string): string {
	return new URL(uri, 'http://localhost:8000').toString();
}

export type CreateBaseRequestOptions = {
	url: string;
};

export type FetchGetOptions = CreateBaseRequestOptions & {};

async function fetchBase<Response>(
	{ url }: CreateBaseRequestOptions,
	fetchOptions?: RequestInit
) {
	const response = await fetch(makeURL(url), fetchOptions);

	return {
		statusCode: response.status,
		statusText: response.statusText,
		data: (await response.json()) as Response,
	};
}

export async function fetchGET<Response>(requestOptions: FetchGetOptions) {
	return await fetchBase<Response>(requestOptions);
}

export type FetchPostOptions<Body> = CreateBaseRequestOptions & {
	body: Body;
};

export async function fetchPOST<Body, Response>({
	body,
	...requestOptions
}: FetchPostOptions<Body>) {
	return await fetchBase<Response>(requestOptions, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
}
