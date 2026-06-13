const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

type Location = {
	id: string;
	name: string;
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	category: string;
	city?: string;
};

const staticLocations: Location[] = [
	{
		id: "static-eiffel-tower",
		name: "Eiffel Tower",
		description: "A landmark viewpoint in central Paris.",
		address: "Champ de Mars, 5 Avenue Anatole France, Paris",
		latitude: 48.85837,
		longitude: 2.294481,
		category: "Landmark",
		city: "Paris",
	},
	{
		id: "static-louvre",
		name: "Louvre Museum",
		description: "Historic art museum near the Seine.",
		address: "Rue de Rivoli, Paris",
		latitude: 48.860611,
		longitude: 2.337644,
		category: "Museum",
		city: "Paris",
	},
	{
		id: "static-notre-dame",
		name: "Notre-Dame Cathedral",
		description: "Gothic cathedral on Ile de la Cite.",
		address: "6 Parvis Notre-Dame, Paris",
		latitude: 48.852968,
		longitude: 2.349902,
		category: "Historic Site",
		city: "Paris",
	},
	{
		id: "static-arc-de-triomphe",
		name: "Arc de Triomphe",
		description: "Monument at Place Charles de Gaulle.",
		address: "Place Charles de Gaulle, Paris",
		latitude: 48.873792,
		longitude: 2.295028,
		category: "Monument",
		city: "Paris",
	},
	{
		id: "static-musee-orsay",
		name: "Musee d Orsay",
		description: "Museum in a former railway station.",
		address: "1 Rue de la Legion d Honneur, Paris",
		latitude: 48.859961,
		longitude: 2.326561,
		category: "Museum",
		city: "Paris",
	},
	{
		id: "static-luxembourg-gardens",
		name: "Luxembourg Gardens",
		description: "Public garden near the Latin Quarter.",
		address: "Rue de Medicis, Paris",
		latitude: 48.846222,
		longitude: 2.33716,
		category: "Park",
		city: "Paris",
	},
	{
		id: "static-pantheon",
		name: "Pantheon",
		description: "Neoclassical mausoleum in the Latin Quarter.",
		address: "Place du Pantheon, Paris",
		latitude: 48.846191,
		longitude: 2.346079,
		category: "Historic Site",
		city: "Paris",
	},
	{
		id: "static-place-concorde",
		name: "Place de la Concorde",
		description: "Major public square by the Champs-Elysees.",
		address: "Place de la Concorde, Paris",
		latitude: 48.865633,
		longitude: 2.321236,
		category: "Square",
		city: "Paris",
	},
	{
		id: "static-centre-pompidou",
		name: "Centre Pompidou",
		description: "Modern art and cultural center.",
		address: "Place Georges-Pompidou, Paris",
		latitude: 48.860642,
		longitude: 2.352245,
		category: "Museum",
		city: "Paris",
	},
	{
		id: "static-sacre-coeur",
		name: "Sacre-Coeur",
		description: "Basilica on Montmartre hill.",
		address: "35 Rue du Chevalier de la Barre, Paris",
		latitude: 48.886705,
		longitude: 2.343104,
		category: "Basilica",
		city: "Paris",
	},
];

const jsonResponse = (data: unknown, status = 200): Response =>
	new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			...corsHeaders,
		},
	});

const isValidCoordinate = (latitude: number, longitude: number): boolean =>
	Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;

const getLocations = (): Location[] =>
	staticLocations.filter((location) => isValidCoordinate(location.latitude, location.longitude));

const handleRequest = async (request: Request): Promise<Response> => {
	const url = new URL(request.url);

	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: corsHeaders,
		});
	}

	if (request.method !== "GET") {
		return jsonResponse({ error: "Method not allowed." }, 405);
	}

	if (url.pathname === "/" || url.pathname === "/health") {
		return jsonResponse({ message: "Map API Worker is running." });
	}

	if (url.pathname === "/locations") {
		return jsonResponse(getLocations());
	}

	return jsonResponse({ error: "Route not found." }, 404);
};

export default {
	async fetch(request): Promise<Response> {
		try {
			return await handleRequest(request);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unexpected server error.";

			return jsonResponse(
				{
					error: "Unable to process request.",
					message,
				},
				500,
			);
		}
	},
} satisfies ExportedHandler<Env>;
