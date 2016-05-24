{View} = require 'atom-space-pen-views'

module.exports =
class ControlView extends View
  @content: (params) ->
    @div class: 'btn-toolbar git-diff-revert-control', =>
      
      @div class: 'btn-group', =>
        @button class: 'btn icon icon-arrow-up',   title: 'Previous Change', click: 'onPreviousDiff'
        @button class: 'btn icon icon-arrow-down', title: 'Next Change',     click: 'onNextDiff'

      @button class: 'btn icon icon-mail-reply', title: 'Rollback',  click: 'onRevert'
      @button class: 'btn icon icon-diff',       title: 'Show Diff', click: 'onCompare'
      @button class: 'btn icon icon-clippy',     title: 'Copy',      click: 'onCopy'

  initialize: (params) ->
    @onPreviousDiff = params.onPreviousDiff
    @onNextDiff = params.onNextDiff
    @onRevert = params.onRevert
    @onCompare = params.onCompare
    @onCopy = params.onCopy
