let alltunes = [];
let song = [];
let recording = false;
let current_recording = [];
let recording_start = 0;
let new_song_name = "";
let temp_timing = 0;
let song_name = "";
const synth = new Tone.Synth().toDestination();
const NoteMap = {
	"a" : "c4",
  	"w" : "c#4",
	"s" : "d4",
    "e" : "d#4",
    "d" : "e4",
    "f" : "f4",
    "t" : "f#4",
    "g" : "g4",
    "y" : "g#4",
    "h" : "a4",
    "u" : "bb4",
    "j" : "b4",
    "k" : "c5",
    "o" : "c#5",
    "l" : "d5",
    "p" : "d#5",
    ";" : "e5"
};

const PlayNote = async (note) => {
    await Tone.start();
    const now = Tone.now();
    synth.triggerAttackRelease(note, '8n', now);

    if (recording === true) {
        if (current_recording.length === 0) {
            temp_timing = 0;
            recording_start = Tone.now();
        }
        else {
            temp_timing = Tone.now() - recording_start;
        };
        let temp_note = {note: note, duration: "8n", timing: temp_timing};
        current_recording.push(temp_note)
        }
}

const PlayButton = () => {
    const selection = document.getElementById("tunesDrop");
    const song_id = selection.value;
    alltunes.forEach ((element) => {
        if (element.id === song_id){
            song_name = element.name
            song =  element.tune;
        };
    })
    console.log("playing " + song_name);
    PlaySong(song);
    
}

const PlaySong = async (song) => {
    await Tone.start()
    const now = Tone.now();
    song.forEach ((element) => {
        synth.triggerAttackRelease(element.note, element.duration, now + element.timing);
    })
}

const RecordSong = () => {
    document.getElementById("recordbtn").disabled = true;
    document.getElementById("stopbtn").disabled = false;
    recording = true
    console.log("Recording Started")
}

const StopRecording = () => {
    document.getElementById("recordbtn").disabled = false;
    document.getElementById("stopbtn").disabled = true;
    recording = false;
    let new_song = current_recording;
    current_recording = [];
    console.log("Recording Finished");
    CreateSong(new_song);
    document.getElementById("recordName").value = "";
}

const getAllTunes = async () => {
    const url = 'http://localhost:3000/api/v1/tunes';

    try {
        let dropdown_menu = document.getElementById('tunesDrop');
        while (dropdown_menu.length > 0) {                
            dropdown_menu.options.remove(0);
        } 
        const response = await axios.get(url)
        console.log("Success: ", response.data);
        alltunes = [];
        response.data.forEach(item => {
            alltunes.push(item)
        })
        addDropdownOptions();
    }
    catch (error) {
        console.log(error);
    }
}

const addDropdownOptions = () => {
    const dropdown = document.getElementById('tunesDrop'); 
    alltunes.forEach((element) => { 
        const option = document.createElement('option'); 
        option.value = element.id; 
        option.text = element.name; 
        dropdown.add(option);
        console.log("song added: " + option.value)

})}


const CreateSong = async (new_song) => {
    new_song_name = document.getElementById("recordName").value;
    if (new_song_name === "") {
        new_song_name = "No-name Tune";
    }
    if (new_song.length !== 0) {
    await axios.post('http://localhost:3000/api/v1/tunes', {
        name: new_song_name,
        tune: new_song
    })
    console.log("Tune added")
    getAllTunes();
    };
}

document.addEventListener("keypress", async(event) => {
    await Tone.start();
    if (event.repeat) {
        return;
    }
    if (Object.keys(NoteMap).includes(event.key))
        document.getElementById(NoteMap[event.key]).click();
});

window.onload = () => { 
    getAllTunes();
}; 