// I did not write this file I got claude to do it for me don't shoot me I wrote all the code in the other files
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import { clubsTable } from '../server/db/schema';

type ClubRow = typeof clubsTable.$inferInsert;

dotenv.config({ path: '.env.local' });

// Each tuple: [club name, stadium name, latitude, longitude]
type ClubTuple = [string, string, number, number];

const premierLeague: ClubTuple[] = [
    ['Arsenal', 'Emirates Stadium', 51.5549, -0.1084],
    ['Aston Villa', 'Villa Park', 52.5090, -1.8847],
    ['Bournemouth', 'Vitality Stadium', 50.7352, -1.8384],
    ['Brentford', 'Gtech Community Stadium', 51.4907, -0.2886],
    ['Brighton & Hove Albion', 'American Express Stadium', 50.8616, -0.0837],
    ['Chelsea', 'Stamford Bridge', 51.4817, -0.1910],
    ['Coventry City', 'Coventry Building Society Arena', 52.4481, -1.4957],
    ['Crystal Palace', 'Selhurst Park', 51.3983, -0.0856],
    ['Everton', 'Hill Dickinson Stadium', 53.4237, -3.0041],
    ['Fulham', 'Craven Cottage', 51.4750, -0.2217],
    ['Hull City', 'MKM Stadium', 53.7462, -0.3681],
    ['Ipswich Town', 'Portman Road', 52.0550, 1.1450],
    ['Leeds United', 'Elland Road', 53.7778, -1.5722],
    ['Liverpool', 'Anfield', 53.4308, -2.9608],
    ['Manchester City', 'Etihad Stadium', 53.4831, -2.2004],
    ['Manchester United', 'Old Trafford', 53.4631, -2.2913],
    ['Newcastle United', "St James' Park", 54.9756, -1.6217],
    ['Nottingham Forest', 'City Ground', 52.9400, -1.1328],
    ['Sunderland', 'Stadium of Light', 54.9146, -1.3884],
    ['Tottenham Hotspur', 'Tottenham Hotspur Stadium', 51.6043, -0.0664],
];

const laLiga: ClubTuple[] = [
    ['Deportivo Alavés', 'Mendizorrotza', 42.8372, -2.6882],
    ['Athletic Club', 'San Mamés', 43.2642, -2.9495],
    ['Atlético Madrid', 'Riyadh Air Metropolitano', 40.4362, -3.5995],
    ['FC Barcelona', 'Spotify Camp Nou', 41.3809, 2.1228],
    ['Celta Vigo', 'Abanca Balaídos', 42.2118, -8.7396],
    ['Deportivo La Coruña', 'Riazor', 43.3687, -8.4173],
    ['Elche', 'Martínez Valero', 38.2670, -0.6630],
    ['Espanyol', 'RCDE Stadium', 41.3478, 2.0757],
    ['Getafe', 'Coliseum', 40.3256, -3.7143],
    ['Levante', 'Estadio Ciutat de València', 39.4947, -0.3646],
    ['Málaga', 'La Rosaleda', 36.7342, -4.4260],
    ['Osasuna', 'El Sadar', 42.7969, -1.6369],
    ['Racing Santander', 'El Sardinero', 43.4764, -3.7915],
    ['Rayo Vallecano', 'Estadio de Vallecas', 40.3918, -3.6588],
    ['Real Betis', 'Benito Villamarín', 37.3567, -5.9817],
    ['Real Madrid', 'Santiago Bernabéu', 40.4531, -3.6883],
    ['Real Sociedad', 'Reale Arena', 43.3014, -1.9736],
    ['Sevilla', 'Ramón Sánchez-Pizjuán', 37.3840, -5.9706],
    ['Valencia', 'Mestalla', 39.4748, -0.3583],
    ['Villarreal', 'Estadio de la Cerámica', 39.9441, -0.1037],
];

const serieA: ClubTuple[] = [
    ['Atalanta', 'Gewiss Stadium', 45.7089, 9.6808],
    ['Bologna', "Stadio Renato Dall'Ara", 44.4923, 11.3097],
    ['Cagliari', 'Unipol Domus', 39.1993, 9.1365],
    ['Como', 'Stadio Giuseppe Sinigaglia', 45.8133, 9.0746],
    ['Fiorentina', 'Stadio Artemio Franchi', 43.7809, 11.2822],
    ['Frosinone', 'Stadio Benito Stirpe', 41.6428, 13.3437],
    ['Genoa', 'Stadio Luigi Ferraris', 44.4165, 8.9528],
    ['Inter Milan', 'San Siro', 45.4781, 9.1240],
    ['Juventus', 'Allianz Stadium', 45.1096, 7.6412],
    ['Lazio', 'Stadio Olimpico', 41.9340, 12.4547],
    ['Lecce', 'Stadio Via del Mare', 40.3652, 18.1998],
    ['AC Milan', 'San Siro', 45.4781, 9.1240],
    ['Monza', 'U-Power Stadium', 45.5836, 9.3086],
    ['Napoli', 'Stadio Diego Armando Maradona', 40.8280, 14.1931],
    ['Parma', 'Stadio Ennio Tardini', 44.7950, 10.3384],
    ['AS Roma', 'Stadio Olimpico', 41.9340, 12.4547],
    ['Sassuolo', 'Mapei Stadium - Città del Tricolore', 44.7142, 10.6498],
    ['Torino', 'Stadio Olimpico Grande Torino', 45.0417, 7.6500],
    ['Udinese', 'Bluenergy Stadium', 46.0816, 13.2000],
    ['Venezia', 'Stadio Pier Luigi Penzo', 45.4377, 12.3636],
];

const bundesliga: ClubTuple[] = [
    ['FC Augsburg', 'WWK Arena', 48.3236, 10.8861],
    ['Bayer Leverkusen', 'BayArena', 51.0383, 7.0022],
    ['Bayern Munich', 'Allianz Arena', 48.2188, 11.6247],
    ['Borussia Dortmund', 'Signal Iduna Park', 51.4926, 7.4519],
    ['Borussia Mönchengladbach', 'Borussia-Park', 51.1746, 6.3855],
    ['SV Elversberg', 'URSAPHARM-Arena an der Kaiserlinde', 49.3166, 7.1233],
    ['Eintracht Frankfurt', 'Deutsche Bank Park', 50.0686, 8.6455],
    ['SC Freiburg', 'Europa-Park Stadion', 48.0213, 7.8297],
    ['Hamburger SV', 'Volksparkstadion', 53.5871, 9.8987],
    ['TSG Hoffenheim', 'PreZero Arena', 49.2379, 8.8882],
    ['1. FC Köln', 'RheinEnergieStadion', 50.9336, 6.8750],
    ['RB Leipzig', 'Red Bull Arena', 51.3458, 12.3483],
    ['Mainz 05', 'Mewa Arena', 49.9843, 8.2244],
    ['SC Paderborn 07', 'Home Deluxe Arena', 51.7311, 8.7106],
    ['Schalke 04', 'Veltins-Arena', 51.5546, 7.0679],
    ['Union Berlin', 'An der Alten Försterei', 52.4572, 13.5681],
    ['VfB Stuttgart', 'MHPArena', 48.7922, 9.2320],
    ['Werder Bremen', 'Weserstadion', 53.0664, 8.8376],
];

const ligue1: ClubTuple[] = [
    ['Angers', 'Stade Raymond Kopa', 47.4602, -0.5311],
    ['Auxerre', "Stade de l'Abbé-Deschamps", 47.7861, 3.5875],
    ['Brest', 'Stade Francis-Le Blé', 48.4030, -4.4617],
    ['Le Havre', 'Stade Océane', 49.4985, 0.1700],
    ['Le Mans', 'MMArena', 47.9560, 0.2275],
    ['Lens', 'Stade Bollaert-Delelis', 50.4328, 2.8153],
    ['Lille', 'Stade Pierre-Mauroy', 50.6119, 3.1305],
    ['Lorient', 'Stade du Moustoir', 47.7481, -3.3689],
    ['Lyon', 'Groupama Stadium', 45.7653, 4.9822],
    ['Marseille', 'Orange Vélodrome', 43.2698, 5.3959],
    ['Monaco', 'Stade Louis II', 43.7277, 7.4156],
    ['Nice', 'Allianz Riviera', 43.7050, 7.1926],
    ['Paris FC', 'Stade Charléty', 48.8205, 2.3463],
    ['Paris Saint-Germain', 'Parc des Princes', 48.8414, 2.2530],
    ['Rennes', 'Roazhon Park', 48.1075, -1.7128],
    ['Strasbourg', 'Stade de la Meinau', 48.5600, 7.7550],
    ['Toulouse', 'Stadium de Toulouse', 43.5833, 1.4344],
    ['Troyes', "Stade de l'Aube", 48.3103, 4.0944],
];

function toRows(
    clubs: ClubTuple[],
    league: string,
    country: string,
): ClubRow[] {
    return clubs.map(([name, stadiumName, latitude, longitude]) => ({
        name,
        league,
        country,
        stadiumName,
        latitude,
        longitude,
    }));
}

const allClubs: ClubRow[] = [
    ...toRows(premierLeague, 'Premier League', 'England'),
    ...toRows(laLiga, 'La Liga', 'Spain'),
    ...toRows(serieA, 'Serie A', 'Italy'),
    ...toRows(bundesliga, 'Bundesliga', 'Germany'),
    ...toRows(ligue1, 'Ligue 1', 'France'),
];

async function main() {
    const names = allClubs.map((c) => c.name);
    if (new Set(names).size !== names.length) {
        throw new Error('Duplicate club names in seed data');
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    try {
        // Upsert on the unique name column so the script is safe to re-run.
        await db
            .insert(clubsTable)
            .values(allClubs)
            .onConflictDoUpdate({
                target: clubsTable.name,
                set: {
                    league: sql`excluded.league`,
                    country: sql`excluded.country`,
                    stadiumName: sql`excluded.stadium`,
                    latitude: sql`excluded.latitude`,
                    longitude: sql`excluded.longitude`,
                },
            });

        console.log(`Seeded ${allClubs.length} clubs.`);
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});