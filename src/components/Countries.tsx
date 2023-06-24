import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import './Countries.css'
import { LineWave } from "react-loader-spinner";

type Country = {
  name: string;
  region: string;
  area: number;
  flag: string;
};

const Countries: React.FC = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [filterBy, setFilterBy] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(0);

   // Sorting countries based on the selected order (ascending or descending)

  const sortCountries = (countries: Country[]) => {
    return [...countries].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };

   // Toggling the sort order between ascending and descending

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

    // Filtering countries based on the selected filter criteria

  const filterCountries = () => {
    let filtered: Country[] = [];
    if (filterBy === "oceania") {
      filtered = allCountries.filter((country) => country.region === "Oceania");
    } else if (filterBy === "smallerThanLithuania") {
      filtered = allCountries.filter((country) => country.area < 65300);
    }
    setFilteredCountries(sortCountries(filtered));
    setCurrentPage(0);
  };


    // Filter countries based on the selected filter criteria

  useEffect(() => {
    setIsLoading(true);
    fetch("https://restcountries.com/v2/all?fields=name,region,area,flag")
      .then((res) => res.json())
      .then((data) => {
        const sortedCountries = sortCountries(data);
        setAllCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
        setIsLoading(false);
      });
  }, []);


  // Triggering country filtering whenever the filter criteria changes
  useEffect(() => {
    filterCountries();
  }, [filterBy]);


  // Triggering country sorting whenever the sort order or all countries data changes
  useEffect(() => {
    const sortedCountries = sortCountries(allCountries);
    setFilteredCountries(sortedCountries);
  }, [sortOrder, allCountries]);


    // Handling filter selection
  const handleFilter = (filter: string) => {
    setFilterBy(filter);
  };

    // Handling tab selection
  const handleTabSelect = (index: number) => {
    setCurrentPage(index);
  };

   // Rendering countries in tabs based on pagination
  const renderCountriesInTabs = () => {
    const pageCount = Math.ceil(filteredCountries.length / itemsPerPage);
    const tabs = [];
    const tabPanels = [];

    for (let i = 0; i < pageCount; i++) {
      const startIdx = i * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const countriesInTab = filteredCountries.slice(startIdx, endIdx);

         // Generating country elements for each tab
      const countryElements = countriesInTab.map(({ name, region, area, flag }) => (
        <div
          key={name}
          className="bg-slate-200 rounded-md p-4 m-5 shadow-lg flex justify-start gap-10 items-center"
        >
          <img className="w-1/12 border rounded-md" src={flag} alt="" />
          <div>
            <h2 className="text-2xl">Name: {name}</h2>
            <p className="text-xl">Area: {area}</p>
            <p className="text-xl">Region: {region}</p>
          </div>
        </div>
      ));

      tabs.push(<Tab key={i}>{i + 1}</Tab>);
      tabPanels.push(<TabPanel key={i}>{countryElements}</TabPanel>);
    }

    return {
      tabs,
      tabPanels,
    };
  };

  const { tabs, tabPanels } = renderCountriesInTabs();

   // Rendering loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LineWave color="#2563EB" height={120} width={120} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center text-4xl my-10">Countries: {filteredCountries.length}</h2>
      <div className="ms-10">
        <label>
          <span>Sort By: </span>
        </label>
        <button
          className="border p-2 rounded-md shadow-md mx-5 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={toggleSortOrder}
        >
          {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
        <label>
          <span>Filter By: </span>
        </label>
        <button
          className="border p-2 rounded-md shadow-md mx-5 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleFilter("smallerThanLithuania")}
        >
          Smaller Area than Lithuania
        </button>
        <label>
          <span>Filter By: </span>
        </label>
        <button
          className="border p-2 rounded-md shadow-md mx-5 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleFilter("oceania")}
        >
          Oceania
        </button>
      </div>
      <div>
        <Tabs selectedIndex={currentPage} onSelect={handleTabSelect}>
          {tabPanels}
          <TabList className="ml-80 my-20">{tabs}</TabList>
        </Tabs>
      </div>
    </div>
  );
};

export default Countries;
