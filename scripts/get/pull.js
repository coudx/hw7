"use strict";

import { fs } from "fs";
import user from "./user";
import repos from "./repos";

const writeFile = (filePath, data) => {
  try {
    fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch {
    return console.log(err);
  }
};

export async function pull() {
  try {
    const { dbuser } = await user.get();
    await writeFile(`${__basedir}/assets/data/${user}_data.json`, dbuser);
    const { dbrepo } = await repos.get();
    await writeFile(`${__basedir}/assets/data/${user}_repos.json`, dbrepo);
  } catch (err) {
    console.log(err);
  }
}
