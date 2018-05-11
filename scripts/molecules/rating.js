function initRatings(){
    var ratings = $(document.body).getElements(".js_rating");
    var rating_stars = $(document.body).getElements(".js_rating_star");

    rating_stars.each(function(star){
        if(!star.getParent(".js_rating_locked")){
            star.addEvent("click", ratingStarClick);
        }
    });

    ratings.each(function(rating) {
        if (rating.getElements(".js_rating_hoverable")[0]) {
            rating.addEvent("mouseover", ratingHover);
            rating.addEvent("mouseout", ratingUnHover);
        }
    });

    if(isIE6){
        ratings.each(function(rating){
            var unvoted = rating.getElement(".js_rating_unvoted");
            if(unvoted){
                unvoted.addEvent("mouseover", ratingMouseover);
                unvoted.addEvent("mouseout", ratingMouseout);
            }
        });
    }
}

function ratingHover(event){
    this.getElements(".js_rating_hoverable")[0].hide();
    this.getElements(".js_rating_holder")[0].show();
}

function ratingUnHover(event){

    this.getElements(".js_rating_holder")[0].hide();
    this.getElements(".js_rating_hoverable")[0].show();
}

function ratingStarClick(event) {
    event.stop();
    var topLevelParent = this.getParent(".js_rating");
    topLevelParent.getElements(".js_rating_star").removeClass("active");
    this.addClass("active");
    this.getParents(".js_rating_star").addClass("active");
    var parent = this.getParent(".js_rating_unvoted");
    if (parent) {
        parent.removeClass("unvoted");
        parent.removeEvent("mouseover", ratingMouseover);
        parent.removeEvent("mouseout", ratingMouseout);
    }

    topLevelParent.removeEvents("mouseout");
    topLevelParent.removeEvents("mouseover");
}

function ratingMouseover(event){
    event.stop();
    this.getElement(".js_rating_label").addClass("label_hide");
    this.getElements(".js_rating_star").addClass("star_show");
    this.getElements(".js_rating_counter").addClass("counter_show");


}

function ratingMouseout(event){
    event.stop();
    this.getElement(".js_rating_label").removeClass("label_hide");
    this.getElements(".js_rating_star").removeClass("star_show");
    this.getElements(".js_rating_counter").removeClass("counter_show");
}

function ratingAddIEHover(event){
    event.stop();
    this.addClass("star_hovered");
    this.getParents(".js_rating_star").addClass("star_hovered");
}

function ratingRemoveIEHover(event){
    event.stop();
    this.removeClass("star_hovered");
    this.getParents(".js_rating_star").removeClass("star_hovered");
}