{View} = require 'atom-space-pen-views'

module.exports =
class GitChangeMarkerToolbar extends View
  @content: (params) ->
    @div class: 'btn-toolbar git-diff-revert-control', =>

      @div class: 'btn-group', =>
        @button class: 'btn icon icon-arrow-up',   title: 'Previous Change', click: 'onPreviousChange'
        @button class: 'btn icon icon-arrow-down', title: 'Next Change',     click: 'onNextChange'

      @button class: 'btn icon icon-mail-reply', title: 'Rollback',  click: 'onRevert'
      @button class: 'btn icon icon-diff',       title: 'Show Diff', click: 'onCompare'
      @button class: 'btn icon icon-clippy',     title: 'Copy',      click: 'onCopy'

  initialize: (params) ->
    @onPreviousChange = params.onPreviousChange
    @onNextChange = params.onNextChange
    @onRevert = params.onRevert
    @onCompare = params.onCompare
    @onCopy = params.onCopy
