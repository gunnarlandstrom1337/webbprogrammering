
"use strict";
var baseURL = "https://api.sr.se/api/v2/";
// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Read SR channels and dynamically create list of channels
    let url = baseURL + "channels?format=json";
    fetch(url, { method: 'GET' })
        .then(response => response.text())
        .then(data => {
            var jsonData = JSON.parse(data);

            for (var i = 0; i < jsonData.channels.length; i++) {

                var tempImage = jsonData.channels[i].imagetemplate;
                const listChannel = document.getElementById("mainnavlist").innerHTML += "<li id='" + jsonData.channels[i].id + "'>" + `<img src="${tempImage}" alt="Picture of radio channel" width="80px" height="50px">` + jsonData.channels[i].name + "</li>";

                document.getElementById("searchProgram").innerHTML += "<option value='" + jsonData.channels[i].id + "'>" + jsonData.channels[i].name + "</option>";
            }
        })
        .catch(error => {
            alert('There was an error ' + error);
        });
    // Create eventlistener for click on search program
    document.getElementById('searchbutton').addEventListener("click", function (e) {

        var channelid = document.getElementById("searchProgram").value
        openProgramTableau(channelid);
    })
    //
    // Create eventlistener for clicks on dynamically created list of channels in
    mainnavlist
    document.getElementById('mainnavlist').addEventListener("click", function (e) {
        var channelid = e.target.id;
        openProgram(channelid);

    })

})// End of DOM content loaded


async function openProgram(channelid) {
    const headerTemp = await fetch(`${baseURL}channels/${channelid}?format=json`);
    const headerData = await headerTemp.json();
    //console.log(headerData);

    const musicTemp = await fetch(`${baseURL}playlists/rightnow?channelid=${headerData.channel.id}&format=json`);
    const musicData = await musicTemp.json();
    //console.log(musicData);

    const soundTemp = headerData.channel.liveaudio.url;

    // Assign songs
    const musicInfoPrev = musicData.playlist.hasOwnProperty('previoussong') ? "Previous song: " + musicData.playlist.previoussong.description : "";
    const musicInfoCurrent = musicData.playlist.hasOwnProperty('song') ? "Current song: " + musicData.playlist.song.description : "";
    const musicInfoNext = musicData.playlist.hasOwnProperty('nextsong') ? "Next song: " + musicData.playlist.nextsong.description : "";

    var channelTopic = headerData.channel.tagline;
    var channelHeader = headerData.channel.name;

    document.getElementById("info").innerHTML = `<h2>${channelHeader}</h2><h3>${channelTopic}</h3><hr>${musicInfoPrev}<br/>${musicInfoCurrent}<br/>${musicInfoNext}<br /><audio autoplay><source src="${soundTemp}"></audio>`;

    //console.log(soundTemp);

}

async function openProgramTableau(channelid) {
    const tableTemp = await fetch(`${baseURL}scheduledepisodes?channelid=${channelid}&format=json`);
    const tableauData = await tableTemp.json();
    //console.log(tableauData);

    document.getElementById("info").innerHTML = ""

    for (var i = 0; i < tableauData.schedule.length; i++) {

        var tempDate = tableauData.schedule[i].starttimeutc;
        tempDate = tempDate.substring(6, tempDate.length - 2);
        document.getElementById("info").innerHTML += `<h2>${tableauData.schedule[i].title}</h2><h3>${tableauData.schedule[i].description}</h3>${new Date(Number(tempDate)).toUTCString()}<hr/>`;

    }
}