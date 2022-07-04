// To be inserted within <script></script> before </body> in nbplayer output
alert('Collecting');
let cells = document.getElementsByClassName('nb-cell');
let count = 0;
let cellData = [].map.call(cells, cell => {
    let cj = {
        data: "no data found in this page",
        name: 'lions-hopf-' + count.toString,
        title: "no title given for this page"
    }
    if (cell.classList.contains("nb-code-cell")) {
        cj.data = cell.innerHTML;
        cj.script=cell.querySelectorAll("code")[0].textContent;
        cj.type = 'code-cell';
        //cj.title=cj.script.split(' ').slice(0,4).join(' ');
        cj.title = cj.script.match(/^.*$/m)[0];
    }
    if (cell.classList.contains("nb-markdown-cell")) {
        cj.data = cell.innerHTML;
        cj.type = 'markdown-cell';
        let dataText=cell.textContent.replace(/(\s\s+)/gm, "");
        cj.title = dataText.split(' ').slice(0,4).join(' ');
    }
    count++;
    return cj;
});
alert('Collected '+count.toString()+' pages collected');
let cellString = JSON.stringify({
        title: 'XXXBOOKTITLE',
        authors: 'XXXAUTHORS',
        description: 'XXXDESCRIPTION',
        data: cellData
    });
let blob = new Blob([cellString], { type: "text/plain;charset=utf-8" });
saveAs(blob, "Hopf.json");