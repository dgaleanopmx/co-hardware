var videoPlayer;

function hasFlash(version) {
    return swfobject.hasFlashPlayerVersion(version); //swfobject library used to detect flash
}

function onTemplateReady(id) {
    if (videoPlayer){
        if(videoPlayer.autoPlay == "true"){
            if (hasFlash('10')) {
                videoPlayer.play();
            } else {
                (function() {
                    videoPlayer.play();
                }).delay(50);
            }
        }

        if(videoPlayer.spooler) videoPlayer.spooler.hide();
    }
}

function onTemplateLoaded(id) {
    var player;
    var playerParamsEl;
    var playerObjEl = $(id);
    if(playerObjEl.getParent){
         playerParamsEl = $(id).getParent('.js_brightcove_player');
    }else{  //IE7-8 fix
        playerParamsEl = $(playerObjEl.parentNode);
        while (!playerParamsEl.hasClass('js_brightcove_player')){
            playerParamsEl = $(playerParamsEl.parentNode);
        }
    }

    if (hasFlash('10')) {
        // get a reference to the player, these functions won't work with HTML5 players
        player = brightcove.getExperience(id);
        // get references to the experience and video player modules
        videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
    } else {
        player = brightcove.api.getExperience(id);
        videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
    }
    if(videoPlayer && playerParamsEl){
       videoPlayer.autoPlay = playerParamsEl.get("data-autoPlay");
       videoPlayer.spooler = playerParamsEl.getElement(".cs_spooler");
    }
}