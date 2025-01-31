import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ScoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreInfoModal({
  isOpen,
  onClose,
}: ScoreInfoModalProps) {
  const SCORING_METHOD = process.env.NEXT_PUBLIC_SCORING_METHOD;

  console.log(SCORING_METHOD);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              1
              <Dialog.Title
                as="h3"
                className="text-lg font-bold leading-6 text-gray-900 mb-4"
              >
                점수 계산 방식
              </Dialog.Title>
              <div className="mt-2 space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700">
                    경기 결과 점수
                  </h4>
                  {SCORING_METHOD === "TOP" ? (
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>승리: +1점</li>
                      <li>무승부: +0점</li>
                      <li>패배: +0점</li>
                    </ul>
                  ) : (
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>승리: +3점</li>
                      <li>무승부: +2점</li>
                      <li>패배: +1점</li>
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-green-700">출석 점수</h4>
                  {SCORING_METHOD === "TOP" ? (
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>출석 점수 없음</li>
                    </ul>
                  ) : (
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>매일 1경기 출석: +2점</li>
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-green-700">
                    대회 입상 보너스
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>입상 보너스 점수는 경기이사와 조율 예정</li>
                    {/* <li>준우승: +3점</li>
                    <li>4강: +1점</li> */}
                  </ul>
                </div>

                <div className="text-sm text-gray-500 mt-4">
                  * 최종 점수는 경기 결과 점수와 대회 입상 보너스의 합계로
                  산정됩니다.
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="tennis-button w-full"
                  onClick={onClose}
                >
                  확인
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
