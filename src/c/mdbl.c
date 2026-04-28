#include <pebble.h>

int main(void) {
  Window *w = window_create();
  window_stack_push(w, true);

  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());

  moddable_createMachine(NULL);

  window_destroy(w);
}
