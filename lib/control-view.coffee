{View} = require 'atom-space-pen-views'

module.exports =
class ControlView extends View
  @content: (params) ->
    @div class: 'overlay', =>
      @div class: 'block text-highlight', 'Git Blame Error:'
      @div class: 'error-message block', params.message
      @div class: 'block', =>
        @button class: 'btn', click: params.onOk, 'Ok'
