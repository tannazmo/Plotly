function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray1 = samples.filter(sampleObj1 => sampleObj1.id == sample);
    console.log(resultArray1);
    //  5. Create a variable that holds the first sample in the array.
    var result1 = resultArray1[0];
    console.log(result1);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIdArray = result1.otu_ids;
    console.log(otuIdArray);

    var otuLabelArray = result1.otu_labels;
    console.log(otuLabelArray);

    var sampleValueArray = result1.sample_values;
    console.log(sampleValueArray);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var top10otuIds = otuIdArray.slice(0,10).reverse();
    console.log(top10otuIds);
    
    var yticks = top10otuIds.map(function(item){return "UTO "+String(item)+" "})
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sampleValueArray.slice(0,10).reverse(),
        y: yticks,
        text: otuLabelArray.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIdArray,
      y: sampleValueArray,
      text: otuLabelArray,
      mode: 'markers',
      marker: {
        size: sampleValueArray,
        color: otuIdArray,
        colorscale: "Jet",
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}, 
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
      hovermode:'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  });
}


    // // 4. Create the trace for the gauge chart.
    // var gaugeData = [
    //   {
    //     domain: { x: [0, 1], y: [0, 1] },
    //     value: 450,
    //     title: { text: "Belly Button Washing Frequency" },
    //     type: "indicator",
    //     mode: "gauge+number",
    //     delta: { reference: 400 },
    //     gauge: { axis: { range: [null, 500] } }
    //   }
    // ];
    
    // // 5. Create the layout for the gauge chart.
    // var gaugeLayout = { 
    //   width: 600, 
    //   height: 400 
    // };

    // // 6. Use Plotly to plot the gauge data and layout.
    // Plotly.newPlot("gauge", gaugeData, gaugeLayout);