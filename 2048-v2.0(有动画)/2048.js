$(function(){

  var size = 4;

  var array = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

  var transition_duration = 200;

  function num_produce(){
    var null_array = [];
    _.each(array,function(value,index){
      var one_index = index;
      _.each(value,function(value,two_index){
        if(value == 0){
          null_array.push([one_index,two_index]);
        }
      });
    });
    var random_index = parseInt(Math.random()*1000)%(null_array.length);
    var null_index = null_array[random_index];

    array[null_index[0]][null_index[1]] = 2;

    var index = size*null_index[0] + null_index[1];
    var $li_random = $(".move>li:nth("+index+")");
    setTimeout(function(){
      $li_random.css("transform","scale(0.2,0.2)").css("background","#dacbcb");
      setTimeout(function(){
        $li_random.html(2).addClass("transition").css({"transform":"scale(1,1)"});
      },10);
    },300);

  }

  function array_transposition(array){
    var array_original = array;
    var array_copy = [[],[],[],[]];
    _.each(array,function(value,index){
      var one_index = index;
      _.each(value,function(value,two_index){
        array_copy[one_index][two_index] = array_original[two_index][one_index];
      });
    });
    return array_copy;
  }

  function array_reset(){
    $(".move>li").html("").css("background","#bbb");
    _.each(array,function(value,index){
      var one_index = index;
      _.each(value,function(value,two_index){
        var index = size*one_index + two_index;
        if(value != 0){
          $(".move>li:nth("+index+")").html(value).css("background",color_change(value));
        }
      });
    });
  }

  function color_change(num){
    switch(num){
      case 2:return "#dacccc";break;
      case 4:return "#dabbbb";break;
      case 8:return "#daaaaa";break;
      case 16:return "#da9999";break;
      case 32:return "#da7777";break;
      case 64:return "#bb7777";break;
      case 128:return "#997777";break;
      case 256:return "#667777";break;
      case 512:return "#447777";break;
      case 1024:return "#225555";break;
      case 2048:return "#444";break;
      default:return "#333";
    }
  }

  num_produce();
  num_produce();

  function array_move(direction){
    var direction_flag_1 = 0;
    var direction_flag_2 = 0;

    if(direction == "bottom" || direction == "right"){
      direction_flag_1 = 1;
    }

    if(direction == "top" || direction == "bottom"){
      direction_flag_2 = 1;
    }


    if(direction_flag_2 == 1){
      array = array_transposition(array);
    }

    var array_move =[];

    _.each(array,function(value,index){

      var one_index = index;
      var full_array = [];
      var full_index_array = [];
      _.each(value,function(value,two_index){
        if(value != 0){
          full_array.push(value);
          full_index_array.push(two_index);
        }
      });

      var final_array = [];
      var final_index_array = [];
      if(direction_flag_1 == 0){
        _.each(full_array,function(value,index,list){
          if(index != 0){
            if(list[index] == list[index-1]){
              list[index] = 0;
              final_array.push(value*2);
              final_index_array.push(final_array.length-1,final_array.length-1);
            }
            else{
              if(list[index-1] != 0){
                final_array.push(list[index-1]);
                final_index_array.push(final_array.length-1);
              }
              if(index == list.length-1){
                final_array.push(list[index]);
                final_index_array.push(final_array.length-1);
              }
            }
          }
          else{
            if(list.length == 1){
              final_array.push(value);
              final_index_array.push(0);
            }
          }
        });
      }

      else if(direction_flag_1 == 1){
        _.reduceRight(full_array,function(memo,value,index,list){
          if(index != list.length-1){
            if(list[index] == list[index+1]){
              list[index] = 0;
              final_array.unshift(value*2);
              final_index_array.unshift(size - final_array.length,size - final_array.length);
            }
            else{
              if(list[index+1] != 0){
                final_array.unshift(list[index+1]);
                final_index_array.unshift(size - final_array.length);
              }
              if(index == 0){
                final_array.unshift(list[index]);
                final_index_array.unshift(size - final_array.length);
              }
            }
          }
          else{
            if(list.length == 1){
              final_array.unshift(value);
              final_index_array.unshift(size - 1);
            }
          }
        },[]);
      }


      ~function(){
        if(final_array.length < size){
          if(direction_flag_1 == 0){
            final_array.push(0);
          }
          else if(direction_flag_1 == 1){
            final_array.unshift(0);
          }
          arguments.callee();
        }
      }();


      function move_animate(value,index){
        var distance = 110*(full_index_array[index] - value);
        if(distance != 0){
          if(direction_flag_2 == 0){
            var old_li = size*one_index + full_index_array[index];
            var new_li = size*one_index + final_index_array[index];
            var new_value = final_array[final_index_array[index]];
            var move_direction = "translateX";
          }
          else if(direction_flag_2 == 1){
            var old_li = size*full_index_array[index] + one_index;
            var new_li = size*final_index_array[index] + one_index;
            var new_value = final_array[final_index_array[index]];
            var move_direction = "translateY";
          }

          $(".move>li:nth("+old_li+")").addClass("transition").css("transform",move_direction+"("+(-distance)+"px)");
          setTimeout(function(){
            $(".move>li:nth("+old_li+")").html("").removeClass("transition").css({"background":"transparent","transform":"none"});
            $(".move>li:nth("+new_li+")").html(new_value).css("background",color_change(new_value));
          },transition_duration);
        }
      }

      if(direction_flag_1 == 0){
        _.each(final_index_array,function(value,index,list){
          move_animate(value,index);
        });
      }

      else if(direction_flag_1 == 1){
        _.reduceRight(final_index_array,function(memo,value,index,list){
          move_animate(value,index);
        },[]);
      }


      array_move.push(final_array);

    });

    if(array.toString() != array_move.toString()){
      array = array_move;
      if(direction_flag_2 == 1){
        array = array_transposition(array);
      }
      num_produce();
    }
    else{
      if(direction_flag_2 == 1){
        array = array_transposition(array);
      }
    }
  }

  $(document).keydown(function(e){
    if(e.keyCode == 65){
      array_move("left");
    }
    else if(e.keyCode == 68){
      array_move("right");
    }
    else if(e.keyCode == 87){
      array_move("top");
    }
    else if(e.keyCode == 83){
      array_move("bottom");
    }
  });


});
