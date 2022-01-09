//Definimos todas las constantes
const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

//Dibujamos el boceto
const width = 800
const height = 600
const margin = {
top: 10, 
bottom: 40,
left: 20, 
right: 10
}

//Declaramos el svg
const svg = d3
    .select("#chart")
    .append("svg")
	.attr('id', "svg")
    .attr("width", width)
	.attr("height", height)

const elementGroup = svg
    .append("g")
	.attr('id', "elementGroup")
	.attr("transform", `translate(${margin.left}, ${margin.top})`)

//Definimos la escala
let x = d3
    .scaleBand()
    .range([0, width - margin.left - margin.right])
    .padding(0.2)

let y = d3
.scaleLinear()
.range([height - margin.top - margin.bottom, 0])



//Definimos los ejes
const axisGroup = svg.append("g").attr('id', "axisGroup")

const xAxisGroup = axisGroup
    .append("g")
	.attr("id", "xAxisGroup")
	.attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)

const yAxisGroup = axisGroup
    .append("g")
	.attr("id", "yAxisGroup")
	.attr("transform", `translate(${margin.left}, ${margin.top})`)

const xAxis = d3.axisBottom().scale(x)

const yAxis = d3.axisLeft().scale(y)

var tooltip = elementGroup.append("g").attr("id", "tooltip");
var label = d3.select("body").append("div").attr("class", "label");


//LLamamos a los datos
d3.csv("data.csv").then(datos2 => {
    datos2.map(d => {
        d.year = +d.year
        //d.name = +d.name
        d.age = +d.age
        
    })

       
    x.domain(datos2.map(d => d.year))
    y.domain([d3.min(datos2.map(d => d.age)) - 2, ageToday])

    var myColor = d3.scaleOrdinal().range(d3.schemeSet3)

    xAxisGroup.call(xAxis.tickSize(0.1)).attr("font-size", 12)
    yAxisGroup.call(yAxis.ticks(7).tickSize(- width )).attr("font-size", 12)
    yAxisGroup.select('.domain').remove()

    //Data binding

    let bars = elementGroup.selectAll('rect').data(datos2)
    bars.enter()
    .append('rect')
    .attr("fill", d => myColor(d.name))
    .attr('class', 'bar')
    .attr('x', d => x(d.year))
    .attr('y', d => y(d.age))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.age) - margin.bottom - margin.top)
    .on("mousemove", function (d) {
        label
            .style("display", "inline")
            .html(d.name);
    })
    .on("mouseout", function (d) {
        label.style("display", "none");
    })

    let edadChicasTexto = elementGroup.selectAll("text").data(datos2)
    edadChicasTexto.enter()
    .append('text')
    .attr('class', 'edadChicasTexto')
    .text(d => d.age)
    .attr('text-anchor', 'middle')
    .attr('x', d=> x(d.year) + x.bandwidth()/2)
    .attr('y', d=> y(d.age) - x.bandwidth()+20)
    .attr("font-size", "10px")

    elementGroup.datum(age)
    .append('path')
    .attr('id', 'today')
    .attr('d', d3.line()
        .x(d => x(d.year))
        .y(d => age(d.year - diCaprioBirthYear)))

    let edadDandy = elementGroup.selectAll("text").data(datos2)
    edadDandy.enter()
    .append('text')
    .attr('class', 'text')
    .text(d => d.age)
    .attr('text-anchor', 'middle')
    .attr('x', d => x(d.year) + x.bandwidth()/2)
    .attr('y', d => y(d.age - diCaprioBirthYear)-20)
    .attr("font-size", "10px")

    var circle = elementGroup.selectAll('circle').data(datos2)
    circle.enter()
    .append("circle")
    .attr('class', "circle")
    .attr('cx', d => x(d.year) + x.bandwidth()/2)
    .attr('cy', d => y(d.year - diCaprioBirthYear))
    .attr('r', 5)

    
    })
    