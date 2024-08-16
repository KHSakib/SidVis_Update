let parsedData;

let selectedModel = [];
let currentRawData;

document.addEventListener("DOMContentLoaded", function () {
  Load();
});

function Load() {
  const checkboxes = document
    // .getElementsByClassName("container")[0]
    // .getElementsByClassName("sidebar")[0]
    .getElementsByClassName("dropdown")[0]
    .getElementsByClassName("model")[0]
    .getElementsByTagName("input");

  console.log("------------", checkboxes);

  for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", function () {
      console.log("Checkbox change event triggered");
      if (this.checked) {
        const value = this.value;
        if (!selectedModel.includes(value)) selectedModel.push(value);
        if (selectedModel?.length > 0) {
          const dataDisplay = document.getElementById("specificDataDisplay");
          currentRawData = makeData(selectedModel);
          console.log(selectedModel, currentRawData);
          displayData2(currentRawData, dataDisplay);
        }
        // modelCheckboxSelected(this.id, this.value);
      } else {
        console.log(this.value);
        if (selectedModel.length > 0) {
          const dataDisplay = document.getElementById("specificDataDisplay");
          removeValueFromArray(selectedModel, this.value);
          currentRawData = makeData(selectedModel);
          displayData2(currentRawData, dataDisplay);
        }
        // modelCheckboxDeselected(this.id, this.value);
      }
    });
  }
}

function handleFiles() {
  const fileInput = document.getElementById("csvFileInput");
  console.log(fileInput);
  const file = fileInput.files[0];
  const dataDisplay = document.getElementById("dataDisplay");
  console.log("🚀 ~ handleFiles ~ dataDisplay:", dataDisplay);

  Papa.parse(file, {
    complete: function (results) {
      parsedData = results.data;
      console.log(parsedData);
      displayData(parsedData, dataDisplay); // Call displayData to show the table
    },
    header: true,
  });
}

const csvData = `Model,Accuracy,Precision,Recall,Auc
                    BERT,84.00,100.00,69.23,84.6
                    LSTM,76.00,75.00,85.71,74.7
                    BiLSTM,64.00,69.23,64.23,64.00
                     
                    RF,76.00,80.00,66.67,74.7
                     SVM,76.00,75.00,75.00,76.00
                     GaussianNB,72.00,70.6,85.71,66.2
                     LR,72.00,92.86,68.42,72.8
                     Kneighbors,76.00,92.86,54.54,79.5`;

const csvData2 = `Model,Accuracy,Precision,Recall,Auc
                    BERT,14.00,70.00,69.63,84.6
                    LSTM,16.00,75.00,85.11,74.7
                    BiLSTM,64.00,69.23,64.23,64.00
                     
                    RF,76.00,80.00,66.67,74.7
                     SVM,76.00,75.00,75.00,76.00
                     GaussianNB,72.00,70.6,85.71,66.2
                     LR,72.00,92.86,68.42,72.8
                     Kneighbors,76.00,92.86,54.54,79.5`;
console.log(csvData);

//   Papa.parse(csvData, {
//     complete: function(results) {
//       const parsedData = results.data;

//       const dataDisplay = document.getElementById('specificDataDisplay');

//       displayData(parsedData, dataDisplay);
//     },
//     header: true
//   });

function displayData(data, dataDisplay) {
  // Create a table element to hold the data
  const table = document.createElement("table");
  table.border = "1";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");

  // Add the table headers based on keys from the first row of the data
  if (data.length > 0) {
    Object.keys(data[0]).forEach((key) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    });
  }
  thead.appendChild(headerRow);

  // Add the table rows
  data.forEach((row) => {
    const tableRow = document.createElement("tr");
    Object.values(row).forEach((val) => {
      const tableCell = document.createElement("td");
      tableCell.textContent = val;
      tableRow.appendChild(tableCell);
    });
    tbody.appendChild(tableRow);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  // Clear any previous content and append the new table
  dataDisplay.innerHTML = "";
  dataDisplay.appendChild(table);
}

document.getElementById("start").addEventListener("click", () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    const voiceCommand = event.results[0][0].transcript.toLowerCase();
    displayCommand(voiceCommand);
    // handleVoiceCommand(voiceCommand);
    plotData(voiceCommand, convertStringToObjectArray(currentRawData));
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error", event.error);
  };
});

// function handleVoiceCommand(command) {
//     if (command.includes('change background to')) {
//         const color = command.split('change background to ')[1];
//         document.body.style.backgroundColor = color;
//     } else {
//         console.log('Command not recognized:', command);
//     }
// }

function displayCommand(command) {
  const instructionsElement = document.getElementById("instructions");
  instructionsElement.textContent = `You said: "${command}"`;
}

// document.getElementById('generate_plot').addEventListener('click',()=>{
//     const plotInput = document.getElementById('plotInput').value;
//     plotData(plotInput,convertStringToObjectArray(currentRawData));

// })

document.getElementById("generate_plot").addEventListener("click", () => {
  const plotInput = document.getElementById("plotInput").value;

  try {
    const plotResult = plotData(
      plotInput,
      convertStringToObjectArray(currentRawData)
    );

    // Check if plotResult indicates failure (depending on how plotData is implemented)
    if (!plotResult) {
      //alert('Unable to generate plot. Please check your input.');
    }
  } catch (error) {
    // Catch and handle any errors that occur during plotting
    console.error("Error occurred while generating plot:", error);
    alert("Please Select atleast one Model first.");
  }
});

function plotData(inputData, visualData) {
  const plotTypes = ["bar", "line", "scatter", "pie", "doughnut"];
  const searchData = [
    "Bar", 
    "Line", 
    "Scatter", 
    "Pie", 
    "Doughnut",
    "bar",
    "line",
    "scatter",
    "pie",
    "doughnut",
    "accuracy",
    "precision",
    "recall",
    "auc",
    "score",
    "Accuracy",
    "Precision",
    "Recall",
    "Auc",
    "Score",
  ];
  let inputs = inputData?.split(" ");

  // Filter unique values from arrayB that exist in arrayA
  const searchInput = [
    ...new Set(inputs.filter((value) => searchData.includes(value))),
  ];

  searchInput?.forEach((data, index, array) => {
    const trimmedLowerCase = data.trim().toLowerCase();
    const capitalizedString =
      trimmedLowerCase.charAt(0).toUpperCase() + trimmedLowerCase.slice(1);
    array[index] = capitalizedString;
  });

  console.log("🚀 -------🚀");
  console.log("🚀 ~ ;", searchInput, inputData);
  console.log("🚀 -------🚀");

  const plotType = searchInput[0]?.trim().toLowerCase();
  const columns = searchInput?.slice(1).map((col) => col.trim());

  const ctx = document.getElementById("myChart").getContext("2d");

  // Clear any previous chart
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  // Define a color palette
  const colors = [
    "rgba(255, 99, 132, 0.5)", // Red
    "rgba(54, 162, 235, 0.5)", // Blue
    "rgba(255, 206, 86, 0.5)", // Yellow
    "rgba(75, 192, 192, 0.5)", // Green
    "rgba(153, 102, 255, 0.5)", // Purple
    // Add more colors as needed
  ];

  if (plotTypes.includes(plotType)) {
    // Create datasets for each column
    const datasets = columns.map((column, index) => {
      const color = colors[index % colors.length];
      return {
        label: column,
        data: visualData?.map((row) => row[column]),
        backgroundColor: color,
        borderColor: color.replace("0.5", "1"),
        borderWidth: 1,
      };
    });

    // Create a new chart
    window.myChart = new Chart(ctx, {
      type: plotType,
      data: {
        labels:
          plotType === "scatter"
            ? visualData?.map((row) => row[columns[0]])
            : selectedModel,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

document.getElementById("submit").addEventListener("click", () => {
  submitForm();
});

function submitForm() {
  const selectedPlot = document.getElementById("dataset").value;

  // Get selected feature values
  const selectedFeatures = Array.from(
    document.querySelectorAll(".feature-section input:checked")
  )
    .map((checkbox) => checkbox.value)
    .join(" ");

  // Concatenate the selected plot and feature values
  const resultString = `${selectedPlot} ${selectedFeatures}`;

  // Log or use the resultString as needed
  console.log("Result String:", resultString);

  plotData(resultString, convertStringToObjectArray(currentRawData));
}

// const Model = document.getElementById('model');
// Model.addEventListener('change', function(){
//     const dataDisplay = document.getElementById('specificDataDisplay');

//     displayData();
// })

function removeValueFromArray(array, valueToRemove) {
  const indexToRemove = array.indexOf(valueToRemove);
  if (indexToRemove !== -1) {
    array.splice(indexToRemove, 1);
  }
}

let selectData;

function makeData(selectedModel) {
  console.log("🚀 ~ makeData ~ filteredCsvData:", selectData, selectedModel);

  let rows;
  if (selectData === "data-set-1") {
    rows = csvData.split("\n");
  } else if (selectData === "data-set-2") {
    rows = csvData2.split("\n");
  }
  const filteredRows = rows.filter((row, index) => {
    if (index === 0) {
      // Include the header in the filtered rows
      return true;
    }
    const columns = row.split(",");
    const model = columns[0].trim();
    return selectedModel.includes(model);
  });

  const filteredCsvData = filteredRows.join("\n");

  return filteredCsvData;
}

function displayData2(filteredCsvData, dataDisplay) {
  // Create a table element to hold the data
  const table = document.createElement("table");
  table.border = "1";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const rows = filteredCsvData.split("\n");

  // Add the table headers based on the first row of the filtered data
  const headerRow = document.createElement("tr");
  const headerColumns = rows[0].split(",");
  headerColumns.forEach((column) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = column.trim();
    headerRow.appendChild(headerCell);
  });
  thead.appendChild(headerRow);

  // Add the table rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");
    const tableRow = document.createElement("tr");
    row.forEach((val) => {
      const tableCell = document.createElement("td");
      tableCell.textContent = val.trim();
      tableRow.appendChild(tableCell);
    });
    tbody.appendChild(tableRow);
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  // Clear any previous content and append the new table
  dataDisplay.innerHTML = "";
  dataDisplay.appendChild(table);
}

function convertStringToObjectArray(dataString) {
  const lines = dataString.split("\n");
  const headers = lines[0].split(",");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j].trim();
    }

    result.push(obj);
  }

  return result;
}

/// inserting data set

const dataSet1 = [
  {
    id: "trial_lie_001.txt",
    text: "work slave i really feel like my only purpose in life is to make a higher man money parents forcing me through college and i have too much on my plate i owe a lot of money i know this is the easy way out but i am really tired all of these issues are on top of dealing with tensions in america as well i want to rest",
    deceptive_class: "1",
  },
  {
    id: "trial_lie_002.txt",
    text: "i ll be dead just you wait and see my last words before my death for whoever is interestedi am sorry but youre better off without me youll learn to live without me ",
    deceptive_class: "1",
  },
  {
    id: "trial_lie_003.txt",
    text: "just made this account to test of the site checks account creation date it does not ",
    deceptive_class: "0",
  },
];

const dataSet2 = [
  {
    id: "trial_truth_047.txt",
    text: "asked him instinctively...",
    deceptive_class: "0",
  },
  {
    id: "trial_truth_050.txt",
    text: "At that time on December nineteenth...",
    deceptive_class: "0",
  },
];

// Function to populate the table based on selected dataset
function populateTable(selectedDataset) {
  console.log("🚀 ~ populateTable ~ selectedDataset:", selectedDataset);
  selectData = selectedDataset;
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  let dataSet = [];

  if (selectedDataset === "data-set-1") {
    dataSet = dataSet1;
  } else if (selectedDataset === "data-set-2") {
    dataSet = dataSet2;
  }
  console.log("🚀 ~ populateTable ~ tableBody:", dataSet);

  // Populate the table rows
  dataSet.forEach((data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${data.id}</td>
            <td>${data.text}</td>
            <td>${data.deceptive_class}</td>
        `;
    tableBody.appendChild(row);
  });
}

// Event listener for dropdown change
const dropdown = document.getElementById("train-dataset");
dropdown.addEventListener("change", function () {
  const selectedDataset = this.value;
  populateTable(selectedDataset);
});

// Initial population of the table with the default; dataset
populateTable(dropdown.value);
