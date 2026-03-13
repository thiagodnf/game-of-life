class FileUtils {

    static parseContent(content, hasHeader=false) {

        var data = [];

        content.split("\n").forEach((rows, i) => {

            if (hasHeader && i == 0) {
                return;
            }

            rows = rows.trim();

            if (!rows) {
                return;
            }

            let array = rows.split(",").map(e => e.trim()).map(e => parseInt(e));

            data.push({
                i: array[0],
                j: array[1],
            });
        });

        return data;
    }

    static readCSV(file, hasHeader, callback) {

        var fileReader = new FileReader();

        fileReader.onload = function (e) {

            var content = e.target.result;

            let data = FileUtils.parseContent(content, hasHeader);

            callback && callback(data);
        };

        fileReader.readAsText(file);
    }

    static exportToCSV(cells, fileName = "positions.csv") {

        let content = "";

        for (const cell of cells.values()) {
            content += cell.toString() + "\n";
        }

        var file = new File([content], fileName, { type: "text/csv;charset=utf-8" });

        saveAs(file);
    }
}
