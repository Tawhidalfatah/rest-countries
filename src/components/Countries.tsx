import React, { useEffect, useState } from "react";

type Country = {
  name: string;
  region: string;
  area: number;
  flag: string;
};

const Countries: React.FC = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortCountries = () => {
    const sortedCountries = [...allCountries].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setAllCountries(sortedCountries);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    sortCountries()
  };

  useEffect(() => {
    fetch("https://restcountries.com/v2/all?fields=name,region,area,flag")
      .then((res) => res.json())
      .then((data) => setAllCountries(data));
  }, []);

 

  return (
    <div>
      <h2 className="text-center text-4xl">Countries: {allCountries.length}</h2>
      <div>
        <div className="ms-10">
        <label >
            <span>Sort By : </span>
        </label>
        <button
          className="border p-2 rounded-md shadow-md mx-5 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={toggleSortOrder}
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
        </div>
        {allCountries.map(({ name, region, area, flag }) => (
          <div
            className="bg-slate-200 rounded-md p-4 m-5 shadow-lg flex justify-start gap-10 items-center"
            key={name}
          >
            <img className="w-1/12 border rounded-md" src={flag} alt="" />
            <div>
              <h2 className="text-2xl">Name: {name}</h2>
              <p className="text-xl">Area: {area}</p>
              <p className="text-xl">Region: {region}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countries;
