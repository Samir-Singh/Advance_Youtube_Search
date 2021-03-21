$(document).ready(function(){
	var search,
	API_KEY="AIzaSyDGWytpABNJzyI1e63BLjjlnrZNyR_Ips0",
	url,
  $pagination = $("#pagination"),
  totalRecords = 0,
  records = [],
  recPerPage = 0,
  nextPageToken = ""
  totalPages = 0
	maxResults=11,
  duration="any",
  order="relevance",
  beforedate=new Date().toISOString(),
  afterdate=new Date().toISOString()

  $("#beforedate").val(beforedate)
  $("#afterdate").val(afterdate)

  $("#beforedate").change(function(){
    beforedate=new Date(this.val()).toISOString()
    $("#beforedate").val(beforedate)
    afterdate=new Date(this.val()).toISOString()
    $("#afterdate").val(afterdate)
  })

  $("#afterdate").change(function(){
    afterdate=new Date(this.val()).toISOString()
    $("#afterdate").val(afterdate)
    beforedate=new Date(this.val()).toISOString()
    $("#beforedate").val(beforedate)
  })

  $("#duration").change(function(){
    duration = $(this).children("option:selected").val()
  })
  $("#order").change(function(){
    order = $(this).children("option:selected").val()
  })
	$("#myForm").submit(function(e){
		e.preventDefault()
		search  = $("#search").val()
        url=`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
        &part=snippet&maxResults=${maxResults}&type=video&q=${search}&order=${order}&videoDuration=${duration}&publishedBefore=${beforedate}&publishedAfter=${afterdate}`

        $.ajax({
        	method:'GET',
            url:url,
            beforeSend:function(){
            	$("#btn").attr("disabled",true)
            	$("#search").val("")
            },
            success:function(data){
            	console.log(data)
            	$("#btn").attr("disabled",false)
            	displayVideos(data)
            }
        })

	})

	function displayVideos(data){

    recPerPage = data.pageInfo.resultsPerPage;
    nextPageToken = data.nextPageToken;
    totalRecords = data.pageInfo.totalResults;
    totalPages = Math.ceil(totalRecords/recPerPage);
    apply_pagination();
    $("#search").val("");
    $("#table").show();
    var videoData= "";
		 data.items.forEach(item => {
               videoData = `
               	   <tr>
                  <td>
                  <a target = "_blank" href="https://www.youtube.com/watch?v=${item.id.videoId}">
                     ${item.snippet.title}
                     </a>
                  </td>

                  <td>
                      <img width="200"  height="200"  src="${item.snippet.thumbnails.high.url}"/>
                  </td>

                  <td>
                     <a target="_blank" href="https://www.youtube.com/channel/${item.snippet.channelId}">
                     ${item.snippet.channelTitle}
                     </a>
                  </td>
               	   </tr>
               `;
               $("#results").append(videoData);
		 });
	}

  function apply_pagination(){
    $pagination.twbsPagination({
      totalPages:totalPages,
      visiblePages:6,
      onPageClick:function(event,page){
        displayRecordsIndex = Math.max(page-1,0)*recPerPage;
        endRec = displayRecordsIndex + recPerPage;
        displayRecords = records.slice(displayRecordsIndex,endRec)
        generateRecords(recPerPage,nextPageToken);
      },
    })
  }

  function generateRecords(recPerPage,nextPageToken){
   const url2=`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
        &part=snippet&maxResults=${maxResults}&type=video&q=${search}&pageToken=${nextPageToken}&order=${order}&videoDuration=${duration}&publishedBefore=${beforedate}&publishedAfter=${afterdate}`

        $.ajax({
          method:'GET',
            url:url2,
            beforeSend:function(){
              $("#btn").attr("disabled",true)
              $("#search").val("")
            },
            success:function(data){
              console.log(data)
              $("#btn").attr("disabled",false)
              displayVideos(data)
            }
        })
  }
})