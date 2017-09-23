{View, TextEditorView} = require 'atom-space-pen-views'

module.exports =
class GitChangeMarkerToolbar extends View
  @content: (params) ->
    @div class: 'block git-change-marker-toolbar', =>
      @div class: 'btn-toolbar', =>
        @div class: 'btn-group', =>
          @button class: 'btn icon icon-arrow-up',   title: 'Previous Change', click: 'onPreviousChange'
          @button class: 'btn icon icon-arrow-down', title: 'Next Change',     click: 'onNextChange'
        @button class: 'btn icon icon-mail-reply', title: 'Rollback',  click: 'onRevert'
        @button class: 'btn icon icon-diff',       title: 'Show Diff', click: 'onCompare'
        @button class: 'btn icon icon-clippy',     title: 'Copy',      click: 'onCopy'
      @subview 'diffView', new TextEditorView

  initialize: (params) ->
    @onPreviousChange = params.onPreviousChange
    @onNextChange = params.onNextChange
    @onRevert = params.onRevert
    @onCopy = params.onCopy

    @diffView[0].style.display = 'flex';
    @diffView[0].getModel().setGrammar params.editor.getGrammar()

    git.getLineDiff params.editor.getPath(), params.editor.getText(), params.line
    .then (diff) =>
      @diffView[0].getModel().setText(diff.oldContent)

  # show TextEditorView
  onCompare: (e) ->
    e.stopPropagation()
    if @diffView[0].style.display is 'none'
        @diffView[0].style.display = 'flex'
    else
        @diffView[0].style.display = 'none'
