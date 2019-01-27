$(document).ready(function () {
    var $files = $('#files');
    var fileList;
    var chunks = 0, rows = 0;
    var start, end;
    var chunking = false;
    var result = [];
    var filesHandled = 0;
    var error = false;

    // Get an array of files from the select file input button
    $files.on("input",
        function () {
            fileList = $files[0].files;
            // Set the html text of the box to the name of the files
            var string = "";
            for (var i = 0; i < fileList.length; i++) {
                string = string + fileList[i].name + ", ";
            }
            $("#fileLabel").html(string);
        });

    $('#read-file').click(function () {
        error = false;
        filesHandled = 0;
        result = [];
        chunks = 0;
        rows = 0;
        chunking = false;
        if (fileList.length > 0) {

            // Determine the total size of all files
            var totalFileSize = 0;
            for (var i = 0; i < fileList.length; i++) {
                totalFileSize += fileList[i].size;
            }

            if (totalFileSize >= 1000000 && totalFileSize < 100000000) {
                Papa.LocalChunkSize = totalFileSize / 10 + 1;
                chunking = false;
            }
            // TODO: in chunks naar python
            else if (totalFileSize >= 100000000 && totalFileSize < 1000000000) {
                Papa.LocalChunkSize = totalFileSize / 1000 + 1;
                chunking = true;
                alert("Te grote file");
                return;
            }
            else if (totalFileSize >= 1000000000 && totalFileSize < 10000000000) {
                Papa.LocalChunkSize = totalFileSize / 10000 + 1;
                chunking = true;
                alert("Te grote file");
                return;
            }
            else if (totalFileSize >= 10000000000) {
                alert("Te grote file");
                return;
            }

            var logFile = {
                test: "aapnootmies"
            }

            var config = buildConfig();

            // Start timer
            start = performance.now();
            $files.parse({
                config: config,
                before: function (file, inputElem) {
                    console.log("Parsing file:", file);
                },
                complete: function () {
                    end = performance.now();
                    console.log("Time spend parsing: ", end - start)
                    // Logging the request in forecast API
                    /*$.ajax({
                        url: "/api/log",
                        method: "POST",
                        data: logFile
                    });
                    */
                }
            });

        };
    });



    function errorFn(error, file) {
        console.log("ERROR:", error, file);
    }

    function completeFn(results) {
        // Error thrown by chunk function, because completefn will still be called if the chunk func throws a dimension error, so we handle that here
        if (error) {
            return;
        }
        // If there is no chunking keep the complete result
        // Else the result is the one formed in the chunk function
        if (!chunking) {
            // Skip the first file, because it determines the dimension, check for the others
            if (filesHandled >= 1) {
                // If multiple files get uploaded and they are not the same dimension
                if (result[0].length != results.data[0].length) {
                    alert("Data is not the same dimension");
                    return;
                }
            }
            result = result.concat(results.data);
        }
        filesHandled++;
        if (filesHandled >= fileList.length) {
            console.log("Result: ", result);
            console.log("Chunks:", chunks);
            var x = 0;
            // Send the entire array to a python file on the server who handles the data analysis and recieve the data back from that same file.
            $.ajax({
                data: JSON.stringify(result),
                type: 'POST',
                url: 'http://127.0.0.1:5000/process',
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {
                    var d = new Date();
                    x = d.getTime();
                },
                success: function (data) {
                    console.log(data);
                    var d = new Date();
                    console.log("Time spend by sending to python and getting data back: ", d.getTime() - x, " ms");
                },
                error: function () {
                    alert("ging fout");
                }
            });
            // location.reload();
        }
    }

    function chunkFn(results, streamer) {
        if (!results)
            return;
        // Skip the first file, because it determines the dimension, check for the others
        if (filesHandled >= 1) {
            // If multiple files get uploaded and they are not the same dimension
            if (result[0].length != results.data[0].length) {
                alert("Data is not the same dimension");
                error = true;
                streamer.abort();
                return;
            }
        }
        chunks++;
        rows += results.data.length;

        parser = streamer;

        result = result.concat(results.data);
    }

    function buildConfig() {
        return {
            download: false,
            delimiter: "",
            newline: "",
            header: false,
            dynamicTyping: false,
            preview: 0,
            step: undefined,
            encoding: "",
            worker: false,
            comments: false,
            complete: completeFn,
            error: errorFn,
            download: false,
            fastMode: false,
            skipEmptyLines: true,
            chunk: chunking ? chunkFn : undefined,
            beforeFirstChunk: undefined,
        };

    }
});