//import * as fs from 'node:fs';
import fs from "fs/promises";
import { z } from "zod";

const movieDB = {
  professionals: [],
  movies: [],
  genres: [],
};

//write you code after this line
type Professional = { id: number; name: string; roles: string[] };

type MovieDB = {
  professionals: Professional[];
  movies: [];
  genres: [];
};

const movieSchema = z.object({
  movies: z
    .object({
      title: z.string(),
      year: z.number(),
      runtime: z.number().optional(),
      genres: z.array(z.string()),
      "release-date": z.string(),
      writers: z.array(z.string()),
      actors: z.array(z.string()),
      storyline: z.string().optional(),
      directors: z.array(z.string()),
    })
    .array(),
});

type MainData = z.infer<typeof movieSchema>;

const singularize = (str: string) => str.slice(0, -1);

const addProfessionals = (
  data: MainData,
  professionalsArray: Professional[],
  type: "writers" | "actors" | "directors"
) => {
  const myData = data.movies;
  for (let i = 0; i < myData.length; i++) {
    const movie = myData[i];
    for (let j = 0; j < movie[type].length; j++) {
      const name = movie[type][j].trim();
      const singularType = singularize(type);
      let isDuplicate = false;

      for (let k = 0; k < professionalsArray.length; k++) {
        const element = professionalsArray[k];
        if (element.name === name) {
          isDuplicate = true;
          if (!element.roles.includes(singularType)) {
            element.roles.push(singularType);
          }
          break;
        }
      }

      if (!isDuplicate) {
        professionalsArray.push({
          id: professionalsArray.length + 1,
          name: name,
          roles: [singularType],
        });
      }
    }
  }
};

const readData = async () => {
  try {
    const input = await fs.readFile(`${__dirname}/../data.json`, "utf-8");
    const jsonData = JSON.parse(input);

    const result = movieSchema.safeParse(jsonData);

    if (!result.success) return console.log(result.error.issues);

    const validatedData = result.data;
    addProfessionals(validatedData, movieDB.professionals, "writers");
    addProfessionals(validatedData, movieDB.professionals, "actors");
    addProfessionals(validatedData, movieDB.professionals, "directors");
    console.log(movieDB.professionals);
  } catch (error) {
    console.log(error);
  }
};

readData();
//write your code before this line

export { movieDB };
