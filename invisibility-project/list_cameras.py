"""
Camera finder — lists every camera index OpenCV can open, and shows a live
preview of each one so you can identify which index is your MacBook's
built-in camera vs. your iPhone (Continuity Camera) vs. anything else.

Usage:
    python list_cameras.py

For each detected camera, a window pops up showing its live feed and the
index number in the title bar. Press any key to move to the next camera.
Press 'q' at any point to quit early.
"""

import cv2

MAX_INDEX_TO_TRY = 6  # checks indices 0..5


def main():
    found = []

    for idx in range(MAX_INDEX_TO_TRY):
        cap = cv2.VideoCapture(idx)
        if not cap.isOpened():
            cap.release()
            continue

        ok, frame = cap.read()
        if not ok or frame is None:
            cap.release()
            continue

        found.append(idx)
        print(f"Camera index {idx}: opened successfully, showing preview...")

        window_name = f"Camera index {idx} - press any key for next"
        cv2.imshow(window_name, frame)

        # Keep grabbing frames for a live preview until a key is pressed
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            cv2.imshow(window_name, frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                print("\nQuitting early.")
                print("Cameras found so far:", found)
                return
            if key != 255:  # any other key pressed
                break

        cap.release()
        cv2.destroyWindow(window_name)

    cv2.destroyAllWindows()
    print("\nDone. Working camera indices:", found)
    print("Use the index that showed your MacBook's built-in camera as CAM_INDEX in invisibility_portal.py")


if __name__ == "__main__":
    main()